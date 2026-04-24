document.addEventListener('DOMContentLoaded',()=>{
  const K='helpcommerce_transactions',F=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}),$=id=>document.getElementById(id),
  els={form:$('transaction-form'),desc:$('description'),amount:$('amount'),type:$('type'),category:$('category'),list:$('transactions-list'),income:$('total-income'),expense:$('total-expense'),net:$('net-total'),feedback:$('feedback'),clear:$('clear-all'),dErr:$('description-error'),aErr:$('amount-error'),tErr:$('type-error'),cErr:$('category-error')},
  uid=()=>(crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2),
  load=()=>{try{const x=localStorage.getItem(K),a=x?JSON.parse(x):[];return Array.isArray(a)?a.filter(v=>v&&v.id&&['income','expense'].includes(v.type)&&Number.isFinite(Number(v.amount))):[]}catch{return[]}},
  save=a=>localStorage.setItem(K,JSON.stringify(a)),
  clearErr=()=>{els.dErr.textContent='';els.aErr.textContent='';els.tErr.textContent='';els.cErr.textContent=''},
  err=(n,m)=>{els[n].textContent=m},
  valid=d=>{clearErr();let ok=true;if(!d.description.trim()){err('dErr','Informe a descrição.');ok=false}if(!Number.isFinite(Number(d.amount))||Number(d.amount)<=0){err('aErr','Informe um valor maior que zero.');ok=false}if(!['income','expense'].includes(d.type)){err('tErr','Selecione um tipo.');ok=false}if(!d.category){err('cErr','Selecione uma categoria.');ok=false}return ok},
  fmtDate=iso=>{const d=new Date(iso);return Number.isNaN(d.getTime())?'':d.toLocaleDateString('pt-BR')},
  render=()=>{const a=load();els.list.replaceChildren();if(!a.length){const li=document.createElement('li');li.className='empty-state';li.textContent='Nenhuma transação registrada.';els.list.appendChild(li);return}a.slice().reverse().forEach(tx=>{const li=document.createElement('li');li.className='transaction';const m=document.createElement('div');m.className='transaction-main';const s=document.createElement('strong');s.textContent=tx.description;const p=document.createElement('p');p.textContent=tx.category+' • '+fmtDate(tx.date);m.append(s,p);const side=document.createElement('div');side.className='transaction-side';const amt=document.createElement('span');amt.className='amount '+tx.type;amt.textContent=(tx.type==='expense'?'-':'+')+F.format(Number(tx.amount)||0);const del=document.createElement('button');del.type='button';del.className='delete-btn';del.dataset.action='delete';del.dataset.id=tx.id;del.textContent='🗑️';side.append(amt,del);li.append(m,side);els.list.appendChild(li)})},
  summary=()=>{const a=load().reduce((r,t)=>{const v=Number(t.amount)||0;r[t.type]+=v;r.net+=t.type==='income'?v:-v;return r},{income:0,expense:0,net:0});els.income.textContent=F.format(a.income);els.expense.textContent=F.format(a.expense);els.net.textContent=F.format(a.net)},
  add=d=>{const a=load();a.push({id:uid(),description:d.description.trim().slice(0,80),amount:Math.round(Number(d.amount)*100)/100,type:d.type,category:d.category,date:new Date().toISOString()});save(a);render();summary();els.feedback.textContent='Transação adicionada com sucesso.'},
  del=id=>{save(load().filter(t=>t.id!==id));render();summary();els.feedback.textContent='Transação removida.'},
  clearAll=()=>{save([]);render();summary();els.feedback.textContent='Todas as transações foram apagadas.'};
  els.form.addEventListener('submit',e=>{e.preventDefault();const d={description:els.desc.value,amount:els.amount.value,type:els.type.value,category:els.category.value};if(!valid(d)){els.feedback.textContent='Revise os campos destacados.';return}add(d);els.form.reset();els.desc.focus()});
  els.list.addEventListener('click',e=>{const b=e.target.closest('[data-action="delete"]');if(b)del(b.dataset.id)});
  els.clear.addEventListener('click',()=>{if(load().length)clearAll();else els.feedback.textContent='Não há transações para limpar.'});
  render();summary();
});
