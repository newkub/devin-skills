# Command Line Debugging

## Using jdb

```bash
# Compile with debug info
kotlinc -g:source,lines,vars Main.kt -d Main.jar

# Run with jdb
jdb -attach localhost:8000

# Common jdb commands
stop in MyClass.myMethod
run
step
next
cont
print variable
locals
```

## Using jdwp

```bash
# Run with debug enabled
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=8000 -jar Main.jar

# Connect from another terminal
jdb -attach 8000
```
