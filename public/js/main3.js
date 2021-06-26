var userid = '';
var chatKey = '';
var friend_id = '';
document.addEventListener('DOMContentLoaded', function() 
{
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) 
            {
              //if user is login
              userid = user.uid
              console.log(user)
              loaddata(userid)
              getlist()
              // console.log(userid)
              // document.getElementById('user').innerHTML += user.uid;
              // console.log("Last Login " + user.metadata.lastSignInTime)
              // document.getElementById('email').innerHTML+= user.email;
              document.getElementById('name').innerHTML+= user.displayName;
              document.getElementById('img').src = user.photoURL;
            } 
            else 
            {
              //
              window.location.href = "index.html";
              console.log("user is  not logged in")
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
  firebase.database().ref('users/'+ userid).on('value', snap => 
  {
    if (snap.exists()) 
      {
        console.log("Data Exists")
        console.log(snap.val())
              // KEY
          //     snap.key
          // console.log(snap.key)    
          // //VALUE
          // //snap.val()
          // console.log(snap.val())
          // //snap.exists()
          // console.log(snap.exists())
          // //snap.numChildren()
          // console.log(snap.numChildren())
          // //snap.child()
          // // console.log(snap.child('Uid/email').val())
          // // console.log(snap.child('Uid').key)
          // //snap.hasChildren
          // console.log(snap.hasChildren())
          // console.log("FOR EACH LOOP STARTED BELOW")
          // snap.forEach(function(childsnap) 
          // {
          //   console.log(childsnap.key)
          //   console.log(childsnap.val())
          //   console.log(childsnap.val().Name)
          // })
      } 
      else 
      {
        console.log("Data Doesn't Exists")
        location.href = "register.html"
      } 
  });
}
function getlist() 
{
  firebase.database().ref("users/").on('value', snap => 
  {
    var list = ''
    snap.forEach(childsnap =>
    {
      console.log(childsnap.key)
      if (childsnap.key == userid) 
        {
          list+= ''
          //return;
        } 
        else 
        {     
          list +=
          `<li class="w3-padding-16" onclick="getid('${childsnap.key}','${childsnap.val().profile}','${childsnap.val().uname}','${childsnap.val().status}')" >
            <img src='${childsnap.val().profile}' class="w3-left w3-circle w3-margin-right" style="width:45px">
            <span class="w3-large">${childsnap.val().uname}</span><br>
            <span class="w3-small">${childsnap.val().status}</span><br>
          </li>` 
        }
    })
    document.getElementById('list').innerHTML = list;
    console.log(snap.val())
  })
}
function getid(id,pic,uname,status) 
{
  friend_id = id;
  console.log(friend_id)
  document.getElementById('hdrimg').src = pic;
  document.getElementById('hdrname').innerHTML = uname + " " + `<span class="w3-small w3-opacity">${status}</span>`;
  var friendList = { friendId: id, userId: userid };
    var db = firebase.database().ref('chatkeys');
    var flag = false;
    db.on('value', function (chkeys) 
    {
        chkeys.forEach(function (snap) 
        {
            var user = snap.val();
            // console.log(user)
            if ((user.friendId == friendList.friendId && user.userId == friendList.userId) || ((user.friendId == friendList.userId && user.userId == friendList.friendId))) 
            {
                flag = true;
                chatKey = snap.key;
                console.log(chatKey)
                //loadMsg(chatkey,friendKey);
            }
        });
        if (flag == false) 
        {
            chatKey = firebase.database().ref('chatkeys').push(friendList, function (error) {
                if (error) alert(error);
            }).getKey();
            console.log(chatKey)
            //loadMsg(chatKey,friendKey);
        }
        //loadMsg(chatKey,friendKey);
    });
} 
//var x = 'text';
function sendMsg(ms,x) 
{
  var msgobj = 
    {
      uid: userid,
      msg: ms,
      type: x,
      timestamp: new Date().toLocaleString(),
    };
       firebase.database().ref('Messages').child(chatKey).push(msgobj, function (error) {
        if (error) alert(error);
        else 
        {   
            document.getElementById('sndmsg').value = '';
            document.getElementById('sndmsg').focus();
            loadMsg(chatKey,friendKey);
        }
    });  
} 
function sendFile(fl) 
{
  var file = fl.files[0];
  var ftime = ("CodersClub"+new Date().getTime()); 
  console.log(file)
  console.log(ftime)
  var upload = firebase.storage().ref("File/"+ chatKey).child(ftime).put(file);
  upload.on('state_changed', function(snapshot){
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    upload.snapshot.ref.getDownloadURL().then(function(downloadURL) 
    {
      console.log('File available at', downloadURL);
      // STORING URL
      sendmsg(downloadURL,'img');
      // var msgobj = 
      // {
      //   uid: userid,
      //   msg: downloadURL,
      //   type: 'img',
      //   timestamp: new Date().toLocaleString(),
      // };
      // firebase.database().ref('Messages').child(chatKey).push(msgobj, function (error) {
      //   if (error) alert(error);
      //   else 
      //   {   
      //       document.getElementById('sndmsg').value = '';
      //       document.getElementById('sndmsg').focus();
      //       loadMsg(chatKey,friendKey);  
      //   }
      // });
      // STORING URL
    });
  });
} 
//ENTER KEY SEND MESSAGE
document.addEventListener('keydown', function (key) {
    if (key.which == 13) 
    {
      var ms = document.getElementById('sndmsg').value;
      if (ms == "") 
          alert("Message Can't Be Empty")
        else
          sendMsg(ms);
    }
});