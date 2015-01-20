#A GitHub Repo for GitDNS

```
   ____________________  _   _______
  / ____/  _/_  __/ __ \/ | / / ___/
 / / __ / /  / / / / / /  |/ /\__ \
/ /_/ // /  / / / /_/ / /|  /___/ /
\____/___/ /_/ /_____/_/ |_//____/
```

#What is GitDNS
[GitDNS](https://gitdns.cc) is an awesome DNS manange service use Git


#Quick Start


    git clone @this-rep-url

edit your domain file

    git add @change-file
    git commit -m "say something here"
    git push origin master -u

now your DNS records has modified successful!

#Concept & Syntax

## Domain File
file named by domain name.

##Record Line
one record mapping one line in domain file.

Syntax:

```
-- @type[required]  = record type(A, CNAME, MX, NS ...)
-- @name[required]  = relative name
-- @value[required] = record value(ipadress, domain ...)
-- @ttl[optional]   = TTL (default: user default TTL)
-- @mx[optional]    = MX Priority (default: 5)

type(name, value, ttl, mx)

```
Example:
```
A(@, 1.1.1.1, 默认, 600)
CNAME(gitdns, gitdns.cc, 默认, 600)
MX(@, mxdomain.qq.com., 默认, 600, 10)

```
