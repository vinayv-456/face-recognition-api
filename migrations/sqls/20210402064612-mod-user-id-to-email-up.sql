/* Replace with your SQL commands */

ALTER TABLE authenticate
DROP COLUMN user_id,
ADD COLUMN email character varying NOT NULL;