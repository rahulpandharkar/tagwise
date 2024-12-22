import requests
import serial
import time

# Function to send data to the Node.js server
def send_data_to_server(data):
    url = 'http://localhost:3000/rfid-data'  # Change the URL if needed
    data_to_send = {
        "tagID": data,
        "readerID": "reader14"
    }
    response = requests.post(url, json=data_to_send)  # Send JSON data
    print('Response from the server:', response.text)

while True:
    try:
        # Attempt to open COM4
        ser = serial.Serial('COM4', 9600)  # Change 'COM4' to your desired COM port
        print(f"Connected to COM4 (RFID Reader)")
        
        while True:
            # Read data from the RFID reader connected to COM4
            data = ser.readline().decode('utf-8').strip()
            if data:
                print(f"RFID Tag Value: {data}")
                if "Maersk" in data:
                    rfid_number = data.split()[-1]  # Extract the last word
                    send_data_to_server(rfid_number)  # Send RFID tag data to the Node.js server
            
    except serial.SerialException:
        # Handle the exception when the port is not available
        print("COM4 (RFID Reader) is not available. Retrying in 5 seconds...")
        time.sleep(5)
