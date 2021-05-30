import { OperationType } from "modules/statements/entities/Statement"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

import { CreateStatementError } from './CreateStatementError'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

describe("Create Statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
  })
  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({ email: "test@test.com", name: "test", password: "test" })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "test"
    })

    expect(statement).toHaveProperty("id")
  })

  it("should not be able to create a new statement with a non existing user", async () => {

    const statement = createStatementUseCase.execute({
      user_id: "non existing user id",
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "test"
    })

    await expect(statement).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to create a new statement with insufficient funds", async () => {
    const user = await inMemoryUsersRepository.create({ email: "test@test.com", name: "test", password: "test" })

    await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 1000,
      description: "test"
    })

    const statement = createStatementUseCase.execute({
      user_id: user.id,
      type: 'withdraw' as OperationType,
      amount: 2000,
      description: "test"
    })

    await expect(statement).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
