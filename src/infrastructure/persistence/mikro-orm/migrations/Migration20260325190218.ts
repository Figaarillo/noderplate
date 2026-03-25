import { Migration } from '@mikro-orm/migrations'

export class Migration20260325190218 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" text not null, "phone_number" varchar(255) not null, "city" varchar(255) not null, "province" varchar(255) not null, "country" varchar(255) not null, "role" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "users_pkey" primary key ("id"))'
    )
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email")')
  }
}
