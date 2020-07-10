#!/bin/bash
set -e

# 带时间的日志输出
log() {
  echo -e "\033[31m [$(date '+%Y-%m-%d %H:%M:%S')] $1 \033[0m"
}

version=$1
tag=$2

log "cur version: $version, cur tag: $tag"

log "test"
yarn test:single

log "build code"
yarn build

git add .

if [[ `git status -s | grep -o -E ".*"` ]]
then
  git commit -m "chore: $version code"
fi

log "write version"
npm version $version --message "$version"

git tag -d "v${version}"

log "changelog"
yarn changelog
git add .
git commit -m "chore: $version changelog"

git tag "v${version}"

log "publishing"
npm publish --tag $tag
git push
git push origin v$version