# VisitorDuration
Envoy Solutions Exercise - Visitor Duration
# Visitor Duration App

This app is built for the Envoy platform to track and monitor the duration of a visitor's stay. It validates a configured maximum allowed duration during setup and provides feedback upon visitor sign-out, indicating whether the visitor stayed within the allotted time.

## Features
- **Configuration Step**: Allows the installer to set a maximum allowed duration for visitors (0–180 minutes).
- **Validation**: Ensures only valid duration values can be saved during the setup step.
- **Sign-Out Monitoring**: Calculates the duration of a visitor's stay based on sign-in and sign-out timestamps and attaches a message to the visitor's job indicating whether the duration exceeded the configured limit.

## Requirements
- Node.js (v12)
- Envoy Plugin SDK
- An Envoy account for development and testing
