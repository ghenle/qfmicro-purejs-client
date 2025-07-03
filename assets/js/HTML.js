/**
 * https://www.digitalocean.com/community/tools/minify
 **/
 
import { config } from './config.js';

let HTML = {
  exclaimIcon: ( addClass, title )=>{
    let div = document.createElement('div');
    let ics = document.createElement('span');
    let ice = document.createElement('span');
    let txs = document.createTextNode(config.icons.sourcenote.solid);
    let txe = document.createTextNode(config.icons.sourcenote.clear);

    div.setAttribute('class', `note ${addClass}`);
    ice.setAttribute('title',  title);

    ics.appendChild(txs);
    ice.appendChild(txe);
    div.appendChild(ics);
    div.appendChild(ice);

    return div;
  },
  factSelect: (manFact, typeCallback, topicCallback, factCallback)=>{
    let type  = false;
    let topic = false;

    let sul = document.createElement('ul');
    let sli = document.createElement('li');
    let slt = document.createTextNode(config.factSelect.en.openSelect);
    
    sli.setAttribute('data-mnemonic', '');
    
    sli.appendChild(slt);
    sul.appendChild(sli);
    
    for (const [index, fact] of Object.entries(manFact)) {
      if (fact.type != type) {
        type = fact.type;
        var yul = document.createElement('ul');
        var yli = document.createElement('li');
        var ylt = document.createTextNode(type);
      
        yli.setAttribute('data-type', type);
        yli.setAttribute('role', 'option');
        yli.addEventListener('click', typeCallback);
      
        yli.appendChild(ylt);
        yul.appendChild(yli);
        sli.appendChild(yul);
      }
      if (fact.topic != topic) {
        topic = fact.topic;
        var oul = document.createElement('ul');
        var oli = document.createElement('li');
        var olt = document.createTextNode(topic);
      
        oli.setAttribute('data-type', type);
        oli.setAttribute('data-topic', topic);
        oli.setAttribute('role', 'option');
        oli.addEventListener('click', topicCallback);
      
        oli.appendChild(olt);
        oul.appendChild(oli);
        yli.appendChild(oul);
      }

      let fli = document.createElement('li');
      let flt = document.createTextNode(fact.label);
      
      fli.setAttribute('data-type', type);
      fli.setAttribute('data-topic', topic);
      fli.setAttribute('data-mnemonic', fact.mnemonic);
      fli.setAttribute('role', 'option');
      fli.addEventListener('click', factCallback);
      
      fli.appendChild(flt);
      oli.appendChild(fli);
    }

    return sul;
  }
}

export { HTML };
