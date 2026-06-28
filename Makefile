# Makefile for running the Docker dev stack.
#
# Designed for git worktrees: each worktree gets its own compose project name
# (derived from the directory) and its own free host ports, so several
# instances can run side by side without colliding.

# /dev/tcp port probing below is a bash feature.
SHELL := /bin/bash

# Unique compose project name per checkout, sanitized to [a-z0-9_-].
PROJECT_NAME ?= $(shell basename "$(CURDIR)" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9_-' '-' | sed 's/^-*//;s/-*$$//')

# find-free-port BASE: print the first free TCP port at or above BASE.
define find-free-port
$(shell p=$(1); while ss -ltnH "sport = :$$p" 2>/dev/null | grep -q . \
		|| (exec 3<>/dev/tcp/127.0.0.1/$$p) 2>/dev/null; do \
		p=$$((p+1)); \
	done; echo $$p)
endef

WEB_PORT      ?= $(call find-free-port,3002)
POSTGRES_PORT ?= $(call find-free-port,5432)

# Env passed to every compose invocation.
COMPOSE_ENV = COMPOSE_PROJECT_NAME=$(PROJECT_NAME) WEB_PORT=$(WEB_PORT) POSTGRES_PORT=$(POSTGRES_PORT)
COMPOSE     = $(COMPOSE_ENV) docker compose

.PHONY: dev up down clean ps logs urls

## dev: build + start the stack with file watching (foreground). Default target.
dev: urls
	$(COMPOSE) up --build --watch web

## up: build + start the stack in the background.
up: urls
	$(COMPOSE) up -d --build

## down: stop and remove this instance's containers.
down:
	$(COMPOSE) down

## clean: down + delete this instance's Postgres volume.
clean:
	$(COMPOSE) down -v

## ps: show this instance's containers.
ps:
	$(COMPOSE) ps

## logs: tail logs for this instance.
logs:
	$(COMPOSE) logs -f

## urls: print the project name and chosen ports.
urls:
	@echo "project : $(PROJECT_NAME)"
	@echo "web     : http://localhost:$(WEB_PORT)"
	@echo "postgres: localhost:$(POSTGRES_PORT)"
