import React,{useEffect,useState} from 'react';
import {SafeAreaView,View,Text,TextInput,TouchableOpacity,ScrollView,StyleSheet,Alert,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const staff=[
 {name:'Mehmet Kaynak',role:'Süper Yönetici'},
 {name:'Tuncer Konuk',role:'Yönetici'},
 {name:'Kemal Kırbaş',role:'Yönetici'},
 {name:'Mesut Özbilgiç',role:'Montaj'},
 {name:'Abdülhamit Kaya',role:'İmalat'},
 {name:'İbrahim Nalbant',role:'Marangoz'}
];
const managers=['Süper Yönetici','Yönetici'];
const states=['Planlandı','Yolda','Başlandı','Ertelendi','Eksik malzeme'];
const now=()=>new Date().toLocaleString('tr-TR');
const example=[{id:'ornek-1',customer:'ÖRNEK MÜŞTERİ (DEMO)',phone:'',address:'İzmir / Karşıyaka',product:'90×100 Art Tetra • H190 • parlak şeffaf',date:'2026-11-08',assignee:'Mesut Özbilgiç',department:'Montaj',status:'Planlandı',note:'Montaj öncesi ölçüleri kontrol edin.',updates:[]}];
export default function App(){
 const [person,setPerson]=useState(staff[0]);
 const [jobs,setJobs]=useState(example),[loaded,setLoaded]=useState(false);
 const [screen,setScreen]=useState('list'),[selected,setSelected]=useState(null),[form,setForm]=useState({}),[note,setNote]=useState('');
 const admin=managers.includes(person.role),superAdmin=person.role==='Süper Yönetici';
 useEffect(()=>{AsyncStorage.getItem('dusche-v2-jobs').then(v=>{if(v){try{setJobs(JSON.parse(v))}catch(e){}}setLoaded(true)})},[]);
 useEffect(()=>{if(loaded)AsyncStorage.setItem('dusche-v2-jobs',JSON.stringify(jobs))},[jobs,loaded]);
 const updateJob=(id,fn)=>setJobs(old=>old.map(j=>j.id===id?fn(j):j));
 const log=(j,msg,patch={})=>({...j,...patch,updates:[...(j.updates||[]),{text:msg,by:person.name,time:now()}]});
 const setStatus=(id,status)=>updateJob(id,j=>log(j,'Durum: '+status,{status}));
 const requestApproval=id=>Alert.alert('Yönetici onayına gönder','Bu iş tamamlandı olarak işaretlenmez; yönetici onayını bekler.',[{text:'İptal'},{text:'Gönder',onPress:()=>updateJob(id,j=>log(j,'Tamamlanma onayı istendi',{status:'Onay bekliyor',requestedBy:person.name}))}]);
 const approve=id=>Alert.alert('İşi kapat','Bu işi tamamlandı olarak onaylıyor musunuz?', [{text:'Vazgeç'},{text:'Onayla',onPress:()=>updateJob(id,j=>log(j,'Yönetici onayladı, iş kapatıldı',{status:'Tamamlandı',approvedBy:person.name,approvedAt:now()}))}]);
 const reject=id=>Alert.alert('Onayı reddet','İş yeniden işleme alınacak.',[{text:'Vazgeç'},{text:'Reddet',onPress:()=>updateJob(id,j=>log(j,'Yönetici onayı reddetti, iş yeniden açıldı',{status:'Başlandı',requestedBy:null}))}]);
 const save=()=>{if(!form.customer?.trim()||!form.product?.trim()||!form.assignee){Alert.alert('Eksik bilgi','Müşteri, ürün ve personel zorunludur.');return}const assignee=staff.find(p=>p.name===form.assignee);setJobs(old=>[{id:String(Date.now()),...form,department:assignee.role,status:'Planlandı',updates:[{text:'İş emri oluşturuldu',by:person.name,time:now()}]},...old]);setForm({});setScreen('list')};
 const Field=({name,label,multi=false})=><View style={{marginBottom:10}}><Text style={s.label}>{label}</Text><TextInput style={[s.input,multi&&{height:85,textAlignVertical:'top'}]} multiline={multi} placeholder={label} value={form[name]||''} onChangeText={v=>setForm(f=>({...f,[name]:v}))}/></View>;
 const Button=({title,onPress,light=false,danger=false})=><TouchableOpacity onPress={onPress} style={[s.button,light&&s.light,danger&&{backgroundColor:'#9b3535'}]}><Text style={[s.buttonText,light&&{color:'#17334a'}]}>{title}</Text></TouchableOpacity>;
 const job=jobs.find(j=>j.id===selected);
 const visible=jobs.filter(j=>admin||j.assignee===person.name);
 return <SafeAreaView style={s.root}><StatusBar barStyle="light-content"/><View style={s.header}><Text style={s.brand}>DUSCHE GLASS</Text><Text style={s.sub}>BARTUN BANYO • PERSONEL YÖNETİMİ</Text></View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:16,paddingBottom:55}}>
 <Text style={s.label}>DEMO PERSONEL GÖRÜNÜMÜ (GERÇEK GİRİŞ DEĞİL)</Text><View style={s.staff}>{staff.map(p=><TouchableOpacity key={p.name} onPress={()=>{setPerson(p);setScreen('list')}} style={[s.chip,person.name===p.name&&s.active]}><Text style={{color:person.name===p.name?'white':'#18354d',fontSize:12,fontWeight:'700'}}>{p.name}</Text></TouchableOpacity>)}</View>
 <Text style={s.hint}>Aktif: {person.name} • {person.role}. Bu demo cihaz içinde çalışır; personel seçimi güvenli kimlik doğrulama değildir.</Text>
 {screen==='list'&&<><Text style={s.title}>{admin?'Tüm İş Emirleri':'Görevlerim'}</Text>{admin&&<Button title="+ Yeni iş emri oluştur" onPress={()=>setScreen('new')}/>}<Text style={s.label}>İşler ({visible.length}) • Onay bekleyen: {visible.filter(j=>j.status==='Onay bekliyor').length}</Text>{visible.map(j=><TouchableOpacity key={j.id} style={s.card} onPress={()=>{setSelected(j.id);setNote('');setScreen('detail')}}><Text style={s.customer}>{j.customer}</Text><Text style={s.line}>{j.product}</Text><Text style={s.line}>📍 {j.address||'Adres yok'}</Text><Text style={s.line}>📅 {j.date||'Tarih yok'} • {j.assignee}</Text><Text style={s.status}>{j.status}</Text></TouchableOpacity>)}</>}
 {screen==='new'&&admin&&<><Text style={s.title}>Yeni iş emri</Text><Field name="customer" label="Müşteri adı"/><Field name="phone" label="Müşteri telefonu"/><Field name="address" label="Adres" multi/><Field name="product" label="Ürün, ölçü ve özellikler" multi/><Field name="date" label="Tarih (YYYY-AA-GG)"/><Text style={s.label}>Sorumlu personel</Text>{staff.filter(p=>!managers.includes(p.role)).map(p=><Button key={p.name} title={(form.assignee===p.name?'✓ ':'')+p.name+' • '+p.role} light={form.assignee!==p.name} onPress={()=>setForm(f=>({...f,assignee:p.name}))}/>)}<Field name="note" label="İş talimatı" multi/><Button title="İş emrini kaydet" onPress={save}/><Button title="Vazgeç" light onPress={()=>setScreen('list')}/></>}
 {screen==='detail'&&job&&(admin||job.assignee===person.name)&&<><Button title="← Listeye dön" light onPress={()=>setScreen('list')}/><Text style={s.title}>{job.customer}</Text><View style={s.card}><Text style={s.line}>Telefon: {job.phone||'—'}</Text><Text style={s.line}>Adres: {job.address||'—'}</Text><Text style={s.line}>Ürün: {job.product}</Text><Text style={s.line}>Tarih: {job.date||'—'}</Text><Text style={s.line}>Sorumlu: {job.assignee}</Text><Text style={s.line}>Talimat: {job.note||'—'}</Text><Text style={s.status}>Durum: {job.status}</Text>{job.approvedBy&&<Text style={s.line}>Onaylayan: {job.approvedBy} • {job.approvedAt}</Text>}</View>
 {job.status==='Onay bekliyor'?admin?<><Button title="✓ Tamamlanmayı onayla ve kapat" onPress={()=>approve(job.id)}/><Button title="Onayı reddet / işe geri gönder" danger onPress={()=>reject(job.id)}/></>:<Text style={s.hint}>Tamamlanma bildiriminiz yönetici onayını bekliyor. İş henüz kapanmadı.</Text>:job.status==='Tamamlandı'?<Text style={s.hint}>Bu iş yönetici onayıyla kapatıldı.</Text>:<><Text style={s.label}>İş durumunu güncelle</Text>{states.filter(x=>x!==job.status).map(st=><Button key={st} title={st} light onPress={()=>setStatus(job.id,st)}/>)}<Button title="✓ İş bitti — yönetici onayına gönder" onPress={()=>requestApproval(job.id)}/></>}
 <Text style={s.label}>Açıklama / işlem notu</Text><TextInput style={[s.input,{height:80,textAlignVertical:'top'}]} multiline value={note} onChangeText={setNote} placeholder="Örn. Eksik malzeme nedeniyle yarına kaldı."/><Button title="Notu kaydet" onPress={()=>{if(!note.trim())return;updateJob(job.id,j=>log(j,note.trim()));setNote('')}}/>
 <Text style={s.label}>İşlem geçmişi</Text>{[...(job.updates||[])].reverse().map((u,i)=><View key={i} style={s.card}><Text style={s.line}>{u.text}</Text><Text style={s.hint}>{u.by||'Sistem'} • {u.time}</Text></View>)}
 </>}
 </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#f3f6fa'},header:{backgroundColor:'#102b45',padding:20,paddingTop:26},brand:{color:'#fff',fontSize:25,fontWeight:'900',letterSpacing:2},sub:{color:'#b8cad9',fontSize:11,letterSpacing:1.2,marginTop:4},staff:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12},chip:{backgroundColor:'#e2eaf1',borderRadius:9,padding:9},active:{backgroundColor:'#136b9c'},title:{fontSize:23,fontWeight:'800',color:'#102b45',marginBottom:12},hint:{fontSize:12,color:'#65788a',marginBottom:13},label:{fontSize:14,fontWeight:'700',color:'#34465a',marginVertical:9},input:{backgroundColor:'white',borderColor:'#d7e0e8',borderWidth:1,borderRadius:10,padding:12,fontSize:15,marginBottom:7},button:{backgroundColor:'#136b9c',padding:13,borderRadius:10,alignItems:'center',marginBottom:8},light:{backgroundColor:'#e4edf3'},buttonText:{color:'white',fontWeight:'700'},card:{backgroundColor:'white',padding:16,borderRadius:14,marginBottom:12,borderColor:'#dce4ea',borderWidth:1},customer:{fontSize:18,fontWeight:'800',color:'#102b45',marginBottom:8},line:{fontSize:14,color:'#34465a',marginBottom:6},status:{color:'#0b6a83',fontWeight:'800',marginTop:8}});
