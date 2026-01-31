#!/bin/sh
set -e

# Run tests if RUN_TESTS is set to true
if [ "${RUN_TESTS:-false}" = "true" ]; then
  echo "Running frontend tests..."
  npm run test:run

  if [ $? -ne 0 ]; then
    echo "Tests failed! Not starting dev server."
    exit 1
  fi

  echo "Tests passed!"
fi

echo "Starting dev server..."
exec npm run dev -- --host
