import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseDownload
import io
import pandas as pd

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
print("Hello")
def main():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)
    fileD = "1JRvr_cuE7hja0G--iO2BRAB8bHBvTT30xr0NgnP-SIM"
    request = service.files().export_media(fileId=fileD, mimeType='text/csv')
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
        print("Download %d%%." % int(status.progress() * 100))
    with open ("cgcraw.csv", 'wb') as file:
        file.write(fh.getvalue())
    
    cgc = pd.read_csv("cgcraw.csv", usecols=['ID','Type', 'Name', 'Cost', 'Traits','Strength','Health','Restore','Effect','Notes','Color'])
    #print(cgc)
    cgc = cgc.dropna(axis=0, how="all")
    #print(cgc)

    cgc.to_csv("js/cgc.csv")

if __name__ == "__main__":
    main()