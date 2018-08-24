# Infractions

This module provides tools to help record undesirable user activity. Members with the correct permission level can create, update, and delete infractions referring to another member to inform moderation purposes.

## Model
An infraction is made up of the following data:
- A unique ID
- A member user ID
- A UTC timestamp when created
- A UTC timestamp when last updated
- A text description providing the reason for the infraction

## Commands
- ``: Creates the infraction for the mentioned member with the given id
- ``: Updates the infraction for the mentioned member with the given id
- ``: Deletes the infraction for the mentioned member with the given id
- ``: Searches the infractions for the mentioned member with the given text
- ``: Generates a text file listing all infractions for the mentioned member
