#!/bin/bash
# sheet.sh <dir> : 每 6 张拼一张 3x2 联系表
d=$1; cd $d; rm -f sheet_*.png; ls t*.png | split -l 6 - grp_
for g in grp_*; do montage $(cat $g | sed 's/.*/& /') -tile 3x2 -geometry 960x540+4+4 -pointsize 28 -label '%f' -background '#222' -fill white sheet_${g#grp_}.png; done; rm grp_*; ls sheet_*
