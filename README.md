# OFF16Data
ArangoDB data-backend for OFF16Hack

http://www.meetup.com/CODE-Odense/events/230846747/

This is a simple foxx-service (ArangoDB)

Checkout the swagger documentation


#How to use

As long as collection-names are hardcoded, this foxx must be installed in the endpoint */off2016* !
 
In ArangoDB web-interface -> Services, click "Add service" and chose "GitHub". In **mount**, write **_/off2016_**, in **Repository**, write **_CODEOdense/OFF16Data_::. Click "install" - You are good to go!

Check out the swagger documentation on the service for specifics.
Install-script sets up initial data
