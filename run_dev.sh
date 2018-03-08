docker run -t --rm -p 3000:3000 -v "$(pwd)":/app ulexus/meteor meteor --settings settings.dev.json
xdg-open localhost:3000

docker run -t --rm -p 9001:9001 -v "$(pwd)":/app ulexus/meteor npm run storybook 
xdg-open localhost:9001
