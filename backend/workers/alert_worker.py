import os
import sys
import asyncio
from datetime import datetime

# Add root directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.agent import db
from services.email_service import email_service
from google.cloud.firestore_v1.base_query import FieldFilter

class AlertWorker:
    def __init__(self):
        self.db = db
        self.running = False
        self._thread = None
        self.processed_incidents = set()

    async def start(self):
        if self.running:
            return
        self.running = True
        # Create background task
        asyncio.create_task(self._run_loop())
        print("🤖 Alert Worker started. Monitoring incidents...")

    async def stop(self):
        self.running = False
        print("🤖 Alert Worker stopped.")

    async def _run_loop(self):
        """
        Dummy implementation to save Firestore Quota.
        Does not check for alerts or read from DB.
        """
        print("🤖 Alert Worker running in DUMMY mode (Quota Protection).")
        
        while self.running:
            # Just sleep to keep the thread alive without doing anything
            # print("🤖 Alert Worker heartbeat...") 
            await asyncio.sleep(6000) # Sleep for a long time

# Singleton instance
alert_worker = AlertWorker()

if __name__ == "__main__":
    # Test runner
    worker = AlertWorker()
    worker._run_loop()
