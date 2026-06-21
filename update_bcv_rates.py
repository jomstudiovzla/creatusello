import urllib.request
import ssl
import re
import json
import requests
import datetime

# --- CONFIGURACIÓN DE FIREBASE ---
# Usa tu Web API Key de Firebase (disponible en la consola de Firebase > Configuración del proyecto)
FIREBASE_API_KEY = "COLOCA_AQUI_TU_WEB_API_KEY"
FIREBASE_PROJECT_ID = "creatuselloo"

# Credenciales del Administrador para autenticación
ADMIN_EMAIL = "admin@jomstudio.com"
ADMIN_PASSWORD = "VZLA" # O VZLA123, la contraseña que configuraste

def get_bcv_rates():
    """Obtiene las tasas oficiales del BCV directamente de su página web."""
    print("[*] Conectando con bcv.org.ve...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request('https://www.bcv.org.ve/', headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        html = urllib.request.urlopen(req, context=ctx, timeout=15).read().decode('utf-8')
        
        # Extraer USD
        usd_block = html[html.find('id="dolar"'):html.find('id="dolar"')+500]
        usd_str = re.search(r'<strong>\s*(.*?)\s*</strong>', usd_block).group(1)
        usd_rate = float(usd_str.replace('.', '').replace(',', '.'))
        
        # Extraer EUR
        eur_block = html[html.find('id="euro"'):html.find('id="euro"')+500]
        eur_str = re.search(r'<strong>\s*(.*?)\s*</strong>', eur_block).group(1)
        eur_rate = float(eur_str.replace('.', '').replace(',', '.'))
        
        print(f"[+] Tasa obtenida con éxito -> USD: {usd_rate} Bs | EUR: {eur_rate} Bs")
        return {"USD": usd_rate, "EUR": eur_rate}
    except Exception as e:
        print("[-] Error al extraer la tasa del BCV:", e)
        return None

def update_firebase(rates):
    """Sube las tasas a Firestore (settings/rates) usando la REST API de Firebase."""
    if not rates:
        return
        
    print("[*] Iniciando sesión en Firebase como administrador...")
    auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
    auth_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "returnSecureToken": True
    }
    
    try:
        auth_res = requests.post(auth_url, json=auth_data)
        if auth_res.status_code != 200:
            print("[-] Error de autenticación. Verifica tu API Key y credenciales.")
            print(auth_res.json())
            return
            
        id_token = auth_res.json()['idToken']
        
        # Guardar en Firestore: coleccion 'settings', documento 'rates'
        firestore_url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents/settings/rates"
        
        # El formato de Firestore REST es estricto
        doc_data = {
            "fields": {
                "VES": {"doubleValue": rates["USD"]},          # Para compatibilidad con tu frontend
                "USD": {"doubleValue": rates["EUR"]/rates["USD"]}, # Proporción (no obligatoria)
                "EUR": {"doubleValue": 1.0},
                "usd_rate": {"doubleValue": rates["USD"]},
                "eur_rate": {"doubleValue": rates["EUR"]},
                "last_updated": {"stringValue": datetime.datetime.now().isoformat()}
            }
        }
        
        print("[*] Actualizando documento en Firestore...")
        headers = {"Authorization": f"Bearer {id_token}"}
        
        # Usamos PATCH para crear o actualizar
        db_res = requests.patch(firestore_url, headers=headers, json=doc_data)
        if db_res.status_code == 200:
            print("[✓] ¡Tasas del BCV actualizadas correctamente en la base de datos!")
        else:
            print("[-] Error al escribir en Firestore:", db_res.status_code, db_res.text)
            
    except Exception as e:
        print("[-] Error de conexión con Firebase:", e)

if __name__ == "__main__":
    print(f"=== ACTUALIZADOR AUTOMÁTICO BCV === {datetime.datetime.now()}")
    rates = get_bcv_rates()
    update_firebase(rates)
    print("===================================\n")
