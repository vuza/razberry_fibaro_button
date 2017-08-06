# Razberry home automation module for Fibaro "The Button"

Although there is [no official support](https://forum.z-wave.me/viewtopic.php?f=3420&t=23976) for Fibaro's "The Button" by Razberry, both can communicate.
After interviewing Fibaro's "The Button" by a Razberry three buttons get added to the UI.

1. The first virtual button one "Fibaro General Purpose alarm Alarm" is useless - it never fires.
2. The second virtual button is a switch which fires status "on", whenever you press Fibaro's "The Button" - it does not matter how often you press it
3. The third virtual button fires whenever the button's state changes. The following rules apply: `The action is described with a two-digit value: The first digit is the button number, the second digit points to the action of this button (0=short press, 1=release, 2=hold, 3=short press two times, 4 = short press three times, and so on. Examples: Double Click button 2 => 23, Single Click button 1 = 10)`

Unfortunately there is no way to run a scene/do something after you pressed the button once two times in a row, since there is no state change.
What I would like to do, **but is impossible without this module**: Press the button once and start playing music; Press the button once again and stop playing music

## Deployment

1. The install the module, place the `src` folder content at `..z-way-server/automation/modules/Ftb/` and restart the app by typing `sudo service z-way-server restart`.
2. Go to apps at your Razberry's web ui, activate app and chose your button.

## Ansible

You can install the app via Ansible, which is convenient because you don't have to touch your Raspberry Pi.
The Ansible script copies the local files inside the `src` folder to `..z-way-server/automation/modules/Ftb/` at your Raspberry Pi and restarts the z-way-server.

1. Install Ansible at your locale machine
2. Fix IP entries at deployment/hosts
3. Type `ansible-playbook deployment/main.yml -i deployment/hosts`

## Improvements

* Make Ansible install z-way-server (if not already installed)
* Move paths etc. to Ansible config files