CREATE TABLE "aceites" (
	"conta_id" uuid NOT NULL,
	"documento" text NOT NULL,
	"versao" text NOT NULL,
	"aceito_em" timestamp with time zone NOT NULL,
	CONSTRAINT "aceites_conta_id_documento_versao_pk" PRIMARY KEY("conta_id","documento","versao")
);
--> statement-breakpoint
CREATE TABLE "acessos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conta_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"ip" text NOT NULL,
	"porta" integer NOT NULL,
	"em" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telefone" text NOT NULL,
	"apelido" text NOT NULL,
	"bairro" text NOT NULL,
	"criada_em" timestamp with time zone NOT NULL,
	CONSTRAINT "contas_telefone_unique" UNIQUE("telefone"),
	CONSTRAINT "contas_telefone_e164" CHECK ("contas"."telefone" ~ '^\+[1-9][0-9]{7,14}$')
);
--> statement-breakpoint
CREATE TABLE "pedidos_de_codigo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"telefone" text NOT NULL,
	"pedido_em" timestamp with time zone NOT NULL,
	"aviso_versao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessoes" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"conta_id" uuid NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"renovada_em" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telefones_verificados" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"telefone" text NOT NULL,
	"expira_em" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificacoes_em_curso" (
	"telefone" text PRIMARY KEY NOT NULL,
	"iniciada_em" timestamp with time zone NOT NULL,
	"tentativas" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aceites" ADD CONSTRAINT "aceites_conta_id_contas_id_fk" FOREIGN KEY ("conta_id") REFERENCES "public"."contas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_conta_id_contas_id_fk" FOREIGN KEY ("conta_id") REFERENCES "public"."contas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "acessos_conta_id_em" ON "acessos" USING btree ("conta_id","em");--> statement-breakpoint
CREATE INDEX "acessos_em" ON "acessos" USING btree ("em");--> statement-breakpoint
CREATE INDEX "pedidos_de_codigo_telefone_pedido_em" ON "pedidos_de_codigo" USING btree ("telefone","pedido_em");--> statement-breakpoint
CREATE INDEX "sessoes_conta_id" ON "sessoes" USING btree ("conta_id");