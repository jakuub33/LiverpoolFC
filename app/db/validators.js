//Własne funkcje walidujące

//Exportuje 1 obiekt, a w środku walidatory
module.exports = {
    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    
    checkPassword(password) {
        //password 6-20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        return re.test(password);
    },
    
    checkDuration(duration) {
        const re = /^[0-9\-]+$/;
        return re.test(duration);
    },

    checkScore(score) {
        const re = /^[0-9\:]+$/;
        return re.test(score);
    },  

    checkSlug(value, slug) {
        if (value === slug) {
            throw new Error('Nazwa "slug" jest zakazana');
        }
    },
};