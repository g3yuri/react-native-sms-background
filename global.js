export default {
	fatch:function(target,param,call=console.log,fail=console.warn){
        var option = { method:'get' };
        target = target.split(":")
        if (target.length==2){
          option.method = target[0]
          target = target[1]
        } else {
          target = target[0]
        }
        if (target.length){
          target = target.trim()
          if (target[0]=='/')
            target = target.substr(1)
        }
        var mode_file = false
        param = param || {}
        if (param){
            var data = new FormData();
            for (var p in param){
              var b = param[p]
              if ( (b instanceof File) || (b instanceof Blob) ){
                mode_file = true
              }
              data.append(p,b);
            }
            option.body = data;
            if (!mode_file){
            	param.path = target
				option.body = JSON.stringify(param)
				console.log(param)
				console.log(option.body)
				option.headers= {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
            } else{
            	data.append('path',target)
            }
            option.method = 'post'
        }
        //LoadingBar.start()
        var path = 'https://comida.gd.pe/server/d.php'
        console.log(option)
        fetch(path,option).then(r=>r.text())
        .then(r=>{
        	try{
        		r = JSON.parse(r)
        	} catch(e){
	          //LoadingBar.stop()
	          fail(r)
	          //Notify.create({message:e})
	          return
        	}
          //LoadingBar.stop()
          if(r.ok){
              call(r.body);
          } else {
              fail(r.body);
              //Notify.create({message:r.body})
          }
        }).catch(e=>{
          //LoadingBar.stop()
          fail(e)
          //Notify.create({message:e})
        });
    }
}