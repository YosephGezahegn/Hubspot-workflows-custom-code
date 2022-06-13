const axios = require('axios');


exports.main = async (event, callback) => {
  const hubspot_owner_id = event.inputFields['hubspot_owner_id']
  
    let body = 'This is the the body of the NOTE';
    axios.post('https://api.hubapi.com/crm/v3/objects/notes?hapikey=' + process.env.HAPIKEY, {
      
            "properties": {
                "hs_timestamp": Date.now(), // Current time/date
                "hs_note_body": body,// Body of the note
             	"hubspot_owner_id": hubspot_owner_id,// Creator of the note will show up in the deal page as "Note by"
            }
        })
        .then(function(response) {
            //2. Associate Engagement to the currently enrolled object.
            var engagementID = response.data.id;
            axios({
                    method: 'put',
                    url: 'https://api.hubapi.com/crm/v3/objects/notes/' + engagementID + '/associations/deal/' + event.object.objectId + '/note_to_deal?hapikey=' + process.env.HAPIKEY,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(res) {
          
                    console.log("RESPONSE: " + JSON.stringify(res.data))
                })
                .catch(err => {
                    console.log('Error: ' + err.message);
                })
        })
        .catch(err => {
            console.log('Error: ' + err.message);
        });
}