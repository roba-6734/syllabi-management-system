from brownie import SyllabusManager, accounts

def deploy_syllabus_manager():
    admin_account = accounts.load('sepolia_account')  # Load the named account
    syllabus_manager = SyllabusManager.deploy({'from': admin_account})
    print(f"SyllabusManager deployed at {syllabus_manager.address}")

def main():
    deploy_syllabus_manager()
