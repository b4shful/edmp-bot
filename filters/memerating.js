const Discord = require("discord.js");
const jimp = require("jimp");
const Logger = require("../util/Logger");

exports.run = async (client, message) => {
	if (message.attachments) {
		message.attachments.forEach(img => {
			let channelEntropy = new Array(4).fill(0);
			let histogramArray = [
				new Array(256).fill(0),
				new Array(256).fill(0),
				new Array(256).fill(0),
				new Array(256).fill(0)
			];
			let totalEntropy = 0;

			jimp
				.read(img.url)
				.then(function(image) {
					image
						.resize(512, jimp.AUTO, jimp.RESIZE_NEAREST_NEIGHBOR)
						.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
							// generate a histogram of the image channels
							for (let i = 0; i < 4; i++) {
								let curChannel = this.bitmap.data[idx + i];
								histogramArray[i][curChannel]++;
							}

							if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
								// calculate the entropy of each channel
								let imgMp = image.bitmap.width * image.bitmap.height;
								for (let i = 0; i < 4; i++) {
									for (let j = 0; j < 256; j++) {
										let curVal = histogramArray[i][j];
										// normalize the histogram counts to probability
										curVal = curVal / imgMp;
										if (curVal != 0) {
											channelEntropy[i] += curVal * Math.log2(curVal);
										}
									}
								}

								let d = new Date();

								switch (d.getDate() % 5) {
									case 0:
										totalEntropy = channelEntropy[0];
										break;
									case 1:
										totalEntropy = channelEntropy[1];
										break;
									case 2:
										totalEntropy = channelEntropy[2];
										break;
									case 3:
										totalEntropy = channelEntropy[3];
										break;
									case 4:
										for (let i = 0; i < 4; i++) {
											totalEntropy += channelEntropy[i];
										}
										break;
								}

								Logger.log(`Total Entropy is ${-totalEntropy}`);
								Logger.log(`Image size ${image.bitmap.width} x ${image.bitmap.height}`);

								let mult = (d.getDay() % 2) * 10;

								message.channel.send(`I Rate it ${Math.abs(mult - -totalEntropy * 10 / 6)}`);
							}
						});
				})
				.catch(function(err) {});
		});
	}
};

// Filters can have channelIDs as a single string or an array of strings.
// This applies the filter to all IDs listed.
exports.help = {
	name: "memerating",
	allowCategory: "all",
	channelNames: ["general-archive"]
};
