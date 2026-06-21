import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateBcvRate = functions.scheduler.onSchedule('every day 08:00', async (event) => {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (!response.ok) {
      throw new Error(`Error fetching BCV API: ${response.statusText}`);
    }
    const data = await response.json();
    const rate = data.promedio;

    if (rate && typeof rate === 'number') {
      await admin.firestore().collection('configuracion').doc('tasa_bcv').set({
        vesPerUsd: rate,
        lastUpdated: new Date().toISOString(),
        source: 've.dolarapi.com/v1/dolares/oficial'
      }, { merge: true });
      
      console.log(`✅ BCV Rate successfully updated to Bs. ${rate} / USD`);
    } else {
      throw new Error('Invalid rate format received from API');
    }
  } catch (error) {
    console.error('❌ Error updating BCV Rate:', error);
  }
});
