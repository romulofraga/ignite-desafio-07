import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddSenderIDInTableStatements1622734385780 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("statements", new TableColumn({
      name: "sender_id",
      type: "uuid",
      isNullable: true
    }))

    await queryRunner.createForeignKey("statements", new TableForeignKey({
      name: "sender_id",
      columnNames: ['sender_id'],
      referencedTableName: "users",
      referencedColumnNames: ["id"],
      onDelete: "CASCADE",
      onUpdate: "CASCADE"

    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("statements", "sender_id")
    await queryRunner.dropColumn("statements", "sender_id")
  }

}
