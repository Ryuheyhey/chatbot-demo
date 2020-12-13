import * as functions from 'firebase-functions'; 
import * as admin from "firebase-admin"; 
admin.initializeApp(); 
const db = admin.firestore();

// レスポンスの関数
const sendResponse = (response: functions.Response, statusCode: number, body:any) => {
  response.send({
    statusCode,
    body: JSON.stringify(body)
  })
}

export const addDataset = functions.https.onRequest(async(req:any, res:any)=> {
  if(req.method !== 'POST') {
    sendResponse(res, 405, {error: 'Invailed Request!'})
  } else {
    const dataset = req.body
    // JSONの中のオブジェクトの中身のkey('init'などのID)を取り出す
    for (const key of Object.keys(dataset)){
      const data = dataset[key]
      // collectionの中にdocumentがありその中にdataがある
      await db.collection('question').doc(key).set(data)
    }
    sendResponse(res, 200, {message: 'succesfully added dataset!'})
  }
})

// APIの作成
// Cloud Functions でhttps関数の作成