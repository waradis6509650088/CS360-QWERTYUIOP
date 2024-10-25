#!/bin/bash
tmux new-session -d -s foodadvisor 'cd api; yarn && yarn seed && yarn develop'
tmux split-window -h
tmux send 'cd client; yarn && yarn dev' ENTER
