DROP TABLE IF EXISTS "todo";
--> statement-breakpoint
CREATE TABLE "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "task_userId_idx" ON "task" USING btree ("user_id");
