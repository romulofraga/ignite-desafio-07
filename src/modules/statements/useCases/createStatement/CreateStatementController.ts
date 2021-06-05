import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id } = request.user;
    const { user } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    let statement: ICreateStatementDTO
    let user_id: string

    if (type !== 'transfer') {
      user_id = id;
      statement = await createStatement.execute({
        user_id,
        type,
        amount,
        description
      });
    } else {
      await createStatement.execute({
        user_id: id,
        sender_id: id,
        type,
        amount: (-amount),
        description
      })

      statement = await createStatement.execute({
        user_id: user,
        sender_id: id,
        type,
        amount,
        description
      })
    }
    return response.status(201).json(statement);
  }
}
