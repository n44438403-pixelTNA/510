#!/bin/bash
# Update App.tsx handleLogout
sed -i 's/const handleLogout = () => {/const handleLogout = () => {\n    if (state.user) {\n      saveUserToLive(state.user);\n    }/g' App.tsx
