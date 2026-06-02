CREATE TABLE `phone_code` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`phone` text NOT NULL,
	`code` text NOT NULL,
	`purpose` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`usedAt` integer,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `user` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `user` ADD `phoneVerified` integer;