# Remote Debugging

## Configure Remote Debug

1. Run application with debug flags:
   ```bash
   java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar app.jar
   ```

2. Configure remote debug in IDE:
   - IntelliJ: Run → Edit Configurations → Remote
   - Host: localhost
   - Port: 5005

3. Start remote debug session
