#!/usr/bin/env bash
# Re-export WeDo's past events from the TicketsMinistry DB and regenerate
# lib/past-events.ts + public/images/events/.
#
# Needs a tunnel to the DB and credentials in the environment:
#   RDS_HOSTNAME=127.0.0.1 RDS_PORT=3307 RDS_DB_NAME=ebdb RDS_USERNAME=... MYSQL_PWD=... \
#     bash scripts/export-past-events.sh
#
# WeDo = manager 18; manager 2406 also ran shows labelled "We Do Events".
set -euo pipefail
cd "$(dirname "$0")/.."
MYSQL="${MYSQL:-mysql}"
OUT="$(mktemp)"

"$MYSQL" -h "$RDS_HOSTNAME" -P "$RDS_PORT" -u "$RDS_USERNAME" "$RDS_DB_NAME" -N --raw -e "
SELECT JSON_OBJECT('id',e.id,'name',e.name,'start',DATE_FORMAT(e.start_date,'%Y-%m-%dT%H:%i:%s'),'venue',v.name,'city',v.city,
 'banner',e.banner_img,'thumb',e.thumbnail_img,'video',e.trailer_video,'desc',e.description,'jdesc',e.json_desc,
 'artists',(SELECT JSON_ARRAYAGG(a.name) FROM event_artist ea JOIN artists a ON a.id=ea.artist_id WHERE ea.event_id=e.id),
 'fans',(SELECT COALESCE(SUM(s.tot_ticket_count),0) FROM ticket_sales s WHERE s.event_id=e.id AND s.deleted_at IS NULL
         AND s.payment_status IN ('verified','complete','partially verified')))
FROM events e LEFT JOIN venues v ON v.id=e.venue_id
WHERE e.deleted_at IS NULL AND e.start_date < NOW()
  AND (e.manager=18 OR (e.manager=2406 AND e.organizer LIKE 'We Do Events'))
ORDER BY e.start_date DESC;" > "$OUT"

python -I scripts/gen_past_events.py "$OUT" "$PWD"
rm -f "$OUT"
