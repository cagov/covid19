# How to use the sandbox
The sandbox is a way to execute development code in the project without including the code in releases.

This is useful for...
- Creating development data
- Testing code modules
- Developing Test scripts

To run the sandbox in Visual Studio Code, use the `Run -> Start Debugging` menu item.  You can also use the `Run` Icon (Looks like a bug with a play symbol) on the Activity Bar (Little bar on the left).  From the `Run` activity you can select `Sandbox - MISC` from the dropdown of configurations and then hit the corresponding green run arrow to start.  More run scripts can be added if desired in `.vscode\launch.json`.

When debugging begins, the `DEBUG CONSOLE` will show run output and allow you to inspect values during breakpoint time.