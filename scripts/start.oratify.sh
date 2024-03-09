#!/bin/bash

source /home/teamcodingro/miniconda3/etc/profile.d/conda.sh
conda activate venv

cd oratify
nohup python oratify.py &

