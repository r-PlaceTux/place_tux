## Optimized MySQL r/place placement history DB ##

This is a storage-optimized MySQL version of the [official history database of all placed pixels](https://www.reddit.com/r/place/comments/txvk2d/rplace_datasets_april_fools_2022/) during the 2022 r/place event. It's available as three separate gzipped MySQL tables (created by `mysqldump`) on Google Drive at the following URL:

https://drive.google.com/drive/folders/128uOOp9kmDOZLuzJHQNEo-diZjHoJtBc?usp=sharing

The files are:

| File | Dsscription | # records | Size (gzipped) | MD5 checksum (gzipped) |
| --- | --- | --- | --- | --- |
| user_placements.sql.gz | All user pixel placements | 160,353,085 | 2.47GB | 655875d3e441e1a85a07943c2d83bcc5 |
| mod_placements.sql.gz | Placements by Reddit mods | 19 | 1 KB | 53d0fdd8869c0d4c77c121e26bfac3b1 |
| full_hashes.sql.gz | Full user hashes | 10,381,163 | 643 MB | 185960bb385a468a18a1ea257b7a2274 |

### Loading into MySQL ###

These can be loaded into a (previously created) MySQL database with a user with sufficient privileges by running:

`zcat <file.sql.gz> | mysql -u <user> -p <database_name>`

This may take a good 15-30 minutes for the larger table, so go get a coffee!

### Details ###

The original DB has been split into two tables: `placements`, which contains the user-placed pixels, and `mod_placements`, with Reddit mod editions (which modify a rectangular area). A third table, `full_hashes`, contains the original full hashes in case recovering from a `user_id` is required; if this isn't required downloading that table can be skipped.

To save space, the `user_id` field is taken as the first 8 characters of the full user hash in the original DB, which is enough to make it unique (we checked). The pixel color is stored as individual R,G,B colors in the range 0 to 255. Date/times are UTC. The `mod_placements` table contains `width` and `height` instead of the second corner of the changed area; the coordinates of this second corner can be recovered as `x2 = x + width - 1` and `y2 = y + height - 1`.

Note that these tables *have no indices* (`placements` has no PRIMARY KEY either) to minimize file size, so they'll have to be re-created. Some useful indices and the SQL commands to create them (shown here for the main table `placements`) are:

```
CREATE INDEX idx_date_time ON placements (date_time);
CREATE INDEX idx_user_id ON placements (user_id);
CREATE INDEX idx_red ON placements (red);
CREATE INDEX idx_green ON placements (green);
CREATE INDEX idx_blue ON placements (blue);
CREATE INDEX idx_rgb ON placements (red, green, blue);
CREATE INDEX idx_x ON placements (x);
CREATE INDEX idx_y ON placements (y);
CREATE INDEX idx_xy ON placements (x, y);
```

These take about 5 minutes to create (each). Creating them *will* increase the disk size of the DB.

### Duplicates ###

**Warning**: the `placements` table has *duplicate rows*. It also has rows with duplicate `date_time`, `user_id` combinations but where the color and/or position are different. As an example, these are three distinct rows located at position 62417504 in the original CSV:
```
2022-04-03 05:55:09.174 UTC,pv04rH7NrTNW+JsiUR4JMrsfaLFNWCWwLwfV24Mz5+rt3uUZXno40oJNVUpxeXssvib0JRCuDnlh7tqMCuPiPw==,#000000,"619,447"
2022-04-03 05:55:09.174 UTC,pv04rH7NrTNW+JsiUR4JMrsfaLFNWCWwLwfV24Mz5+rt3uUZXno40oJNVUpxeXssvib0JRCuDnlh7tqMCuPiPw==,#000000,"625,440"
2022-04-03 05:55:09.174 UTC,pv04rH7NrTNW+JsiUR4JMrsfaLFNWCWwLwfV24Mz5+rt3uUZXno40oJNVUpxeXssvib0JRCuDnlh7tqMCuPiPw==,#000000,"619,447"
```
These duplicates are probably logging errors but were kept as-is for fidelity.

### Table structures ###

For reference, the full structure of the tables are as follows:
```
> DESCRIBE placements;
+-----------+----------------------+------+-----+---------+-------+
| Field     | Type                 | Null | Key | Default | Extra |
+-----------+----------------------+------+-----+---------+-------+
| date_time | datetime(3)          | NO   | MUL | NULL    |       |
| user_id   | varchar(8)           | NO   |     | NULL    |       |
| red       | tinyint(3) unsigned  | NO   |     | NULL    |       |
| green     | tinyint(3) unsigned  | NO   |     | NULL    |       |
| blue      | tinyint(3) unsigned  | NO   |     | NULL    |       |
| x         | smallint(5) unsigned | NO   |     | NULL    |       |
| y         | smallint(5) unsigned | NO   |     | NULL    |       |
+-----------+----------------------+------+-----+---------+-------+

> DESCRIBE mod_placements;
+-----------+----------------------+------+-----+---------+-------+
| Field     | Type                 | Null | Key | Default | Extra |
+-----------+----------------------+------+-----+---------+-------+
| date_time | datetime(3)          | NO   | PRI | NULL    |       |
| user_id   | varchar(8)           | NO   | PRI | NULL    |       |
| red       | tinyint(3) unsigned  | NO   |     | NULL    |       |
| green     | tinyint(3) unsigned  | NO   |     | NULL    |       |
| blue      | tinyint(3) unsigned  | NO   |     | NULL    |       |
| x         | smallint(5) unsigned | NO   |     | NULL    |       |
| y         | smallint(5) unsigned | NO   |     | NULL    |       |
| width     | smallint(5) unsigned | NO   |     | NULL    |       |
| height    | smallint(5) unsigned | NO   |     | NULL    |       |
+-----------+----------------------+------+-----+---------+-------+

> DESCRIBE full_hashes;
+-----------+-------------+------+-----+---------+-------+
| Field     | Type        | Null | Key | Default | Extra |
+-----------+-------------+------+-----+---------+-------+
| full_hash | varchar(90) | NO   | PRI | NULL    |       |
+-----------+-------------+------+-----+---------+-------+

```
