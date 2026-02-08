let db = {};

exports.handler = async (event) => {
  if(event.httpMethod!=="POST") return {statusCode:405, body:"Method Not Allowed"};

  const data = JSON.parse(event.body||"{}");
  const fp = data.fingerprint;
  if(!fp) return {statusCode:400, body:"Missing fingerprint"};

  if(!db[fp]) db[fp] = {count:0, firstSeen:Date.now()};
  db[fp].count++;

  let status="safe";
  if(db[fp].count>=50) status="leaked";
  else if(db[fp].count>=20) status="potentially_leaked";
  else if(db[fp].count>=5) status="shared";

  return {
    statusCode:200,
    body: JSON.stringify({count:db[fp].count, status})
  };
};
