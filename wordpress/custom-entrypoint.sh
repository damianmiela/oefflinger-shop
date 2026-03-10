#!/bin/bash
set -e

/usr/local/bin/setup-woocommerce.sh &

exec docker-entrypoint.sh "$@"
