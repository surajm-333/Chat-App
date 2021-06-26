var userid = ''

document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) 
            {
              //if user is login
              userid = user.uid
              console.log(user)
              loaddata(userid)
              // console.log(userid)
              document.getElementById('user').innerHTML += user.uid;
              console.log("Last Login " + user.metadata.lastSignInTime)
              document.getElementById('email').innerHTML+= user.email;
              document.getElementById('name').innerHTML+= user.displayName;
              document.getElementById('img').src = user.photoURL;
            } 
            else 
            {
              //
              window.location.href = "index.html";
              console.log("user is not logged in")
            }
        });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        // firebase.analytics(); // call to activate
        // firebase.analytics().logEvent('tutorial_completed');
        // firebase.performance(); // call to activate
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        try {
          let app = firebase.app();
          let features = [
            'auth', 
            'database', 
            'messaging', 
            'storage', 
            'analytics', 
            'remoteConfig',
            'performance',
          ].filter(feature => typeof app[feature] === 'function');
          console.log(`Firebase SDK loaded with ${features.join(', ')}`);
        } catch (e) {
          console.error(e);
          console.log('Error loading the Firebase SDK, check the console.');
        }
        
      });
function out() 
{
  return firebase.auth().signOut();          
}
function loaddata(userid) 
{
  firebase.database().ref('users/'+ userid).once('value', snap => 
  {
    if (snap.exists()) 
      {
        console.log("Data Exists")
        console.log(snap.val())
        // KEY
        // snap.key
    console.log(snap.key)    
    //VALUE
    //snap.val()
    console.log(snap.val())
    //snap.exists()
    console.log(snap.exists())
    //snap.numChildren()
    console.log(snap.numChildren())
    //snap.child()
    // console.log(snap.child('Uid/email').val())
    // console.log(snap.child('Uid').key)
    //snap.hasChildren
    console.log(snap.hasChildren())
    console.log("FOR EACH LOOP STARTED BELOW")
    snap.forEach(function(childsnap) 
    {
      console.log(childsnap.key)
      console.log(childsnap.val())
      console.log(childsnap.val().Name)
    })

      } 
      else 
      {
        console.log("Data Doesn't Exists")
        location.href = "register.html"
      }
    
      
  });
}