CREATE TABLE `sketches` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text,
	`done` integer DEFAULT 0 NOT NULL,
	`preview` text
);
