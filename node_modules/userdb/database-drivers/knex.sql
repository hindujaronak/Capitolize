create table if not exists accounts (
  id           varchar(14) primary key,
  description  varchar(512),
  name         varchar(32) not NULL,
  status       varchar(14) default "ENABLED",
  customData   text,
  created_date integer NULL,
  updated_date integer NULL
) ENGINE = InnoDB;

create trigger accounts_created before insert on `accounts` for each row begin if (NEW.created_date is null) then set NEW.created_date = UNIX_TIMESTAMP(NOW()); end if; end;
create trigger accounts_updated before update on `accounts` for each row begin set NEW.updated_date = UNIX_TIMESTAMP(NOW()); end;

create table if not exists users (
  id          varchar(14) primary key,
  account_id  varchar(14) not null,
  givenName   varchar(64),
  middleName  varchar(64),
  surname     varchar(64),
  username    varchar(64),
  fullName    varchar(256),
  email	      varchar(128),
  password    varchar(512) not NULL,
  password_updated_on integer default 0,
  last_login_on integer default 0,
  last_failed_login_on integer default 0,
  failed_login_count integer default 0,
  emailVerificationToken varchar( 512 ),
  status      varchar(14) default "PENDING",
  customData  text,
  created_date	integer NULL,
  updated_date	integer NULL,
  index idx_users_1 (email),
  index idx_users_2 (email,status),
  constraint fk_users_1 foreign key( account_id ) references accounts(id)  on delete cascade on update cascade
) ENGINE = InnoDB;

create trigger users_created before insert on `users` for each row begin if (NEW.created_date is null) then set NEW.created_date = UNIX_TIMESTAMP(NOW()); end if; end;
create trigger users_updated before update on `users` for each row begin set NEW.updated_date = UNIX_TIMESTAMP(NOW()); end;

create table if not exists roles (
  id           varchar(14) primary key,
  account_id   varchar(14) not null,
  description  varchar(512),
  name         varchar(32) not NULL,
  status       varchar(14) default "ENABLED",
  customData   text,
  created_date integer NULL,
  updated_date integer NULL,
  constraint fk_roles_1 foreign key( account_id ) references accounts(id)  on delete cascade on update cascade
) ENGINE = InnoDB;

create trigger roles_created before insert on `roles` for each row begin if (NEW.created_date is null) then set NEW.created_date = UNIX_TIMESTAMP(NOW()); end if; end;
create trigger roles_updated before update on `roles` for each row begin set NEW.updated_date = UNIX_TIMESTAMP(NOW()); end;

create table if not exists users_roles (
  user_id varchar(14) not NULL,
  role_id varchar(14) not NULL,
  primary key( user_id, role_id ),
  constraint fk_users_roles_1 foreign key(user_id) references users(id) on delete cascade on update cascade,
  constraint fk_users_roles_2 foreign key(role_id) references roles(id) on delete cascade on update cascade
) ENGINE = InnoDB;

create table if not exists old_passwords (
  user_id varchar(14) not NULL,
  password    varchar(512) not NULL,
  created_date	integer NULL,
  index idx_old_passwords_1 (user_id,created_date),
  constraint fk_old_passwords_1 foreign key(user_id) references users(id) on delete cascade on update cascade
) ENGINE = InnoDB;

create trigger old_passwords_created before insert on `old_passwords` for each row begin if (NEW.created_date is null) then set NEW.created_date = UNIX_TIMESTAMP(NOW()); end if; end;
