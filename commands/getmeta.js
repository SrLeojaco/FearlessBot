exports.run = function (message, keyword, bot, db) {
  if (keyword == null) return;
  let author = message.author.tag;
  db.query(
    "SELECT keyword, value, uses, saver.username AS username, approver.username AS approver, lastused, approved, timeadded \
              FROM data_store \
              LEFT JOIN members saver ON data_store.owner=saver.id AND data_store.server=saver.server \
              LEFT JOIN members approver ON data_store.approvedby=approver.id AND data_store.server=approver.server \
              WHERE data_store.server = ? AND keyword = ?",
    [message.channel.guild.id, keyword],
    function (err, rows) {
      if (rows[0] == null) {
        message.channel.send("", {
          embed: {
            title: keyword + " (requested by " + author + ")",
            description:
              ":warning: Nothing is stored for keyword " + keyword + ".",
          },
        });
      } else if (!rows[0].approved) {
        message.channel.send("", {
          embed: {
            title: keyword + " (requested by " + author + ")",
            description: ":warning: This item has not been approved yet.",
          },
        });
      } else {
        let lastused = rows[0].lastused !== null ? rows[0].lastused : "never";
        let timeadded =
          rows[0].timeadded !== null ? rows[0].timeadded : "a long time ago";
        let fieldList = [
          { name: "Uses", value: rows[0].uses },
          { name: "Last Used", value: lastused },
          { name: "Saved By", value: rows[0].username },
          { name: "Time Added", value: timeadded },
        ];
        message.channel.send("", {
          embed: {
            title: keyword + " (requested by " + author + ")",
            description: rows[0].value,
            fields: fieldList,
          },
        });
      }
    }
  );
};
