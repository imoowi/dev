
Install Multipass on MacOS
Download Multipass for MacOS

Run the installer in an account with Administrator privileges.

If you'd like to use Multipass with VirtualBox use this terminal command:

sudo multipass set local.driver=virtualbox
How to launch LTS instances
The first five minutes with Multipass let you know how easy it is to have a lightweight cloud handy. Let’s launch a few LTS instances, list them, exec a command, use cloud-init and clean up old instances to start.

Launch an instance (by default you get the current Ubuntu LTS)

multipass launch --name foo
Run commands in that instance, try running bash (logout or ctrl-d to quit)

multipass exec foo -- lsb_release -a
Pass a cloud-init metadata file to an instance on launch. See using cloud-init with multipass for more details

multipass launch -n bar --cloud-init cloud-config.yaml
See your instances

multipass list
Stop and start instances

multipass stop foo bar
multipass start foo
Clean up what you don’t need

multipass delete bar
multipass purge
Find alternate images to launch with multipass

multipass find
Get help

multipass help
multipass help <command>
Now don’t forget you still have 'foo' running. To learn more about Multipass keep reading, go to the docs, or join the discussion and get involved.