var data;

if(localStorage && localStorage.dataIHM_TActHab) {
	data = localStorage.dataIHM_TActHab;
} else {data = {};}

//______________________________________________________________________________________
// Export Activity constructor
module.exports = data;