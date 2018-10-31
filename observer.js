uiTracker._mutationCallback=function(mutations) {
    clearTimeout(factory.deadClick)

    var session=factory.session

    var session_events=[]

    for(var mutation of mutations) {
        if (mutation.type=="childList") {
            if(mutation.addedNodes){
                for(var i=0;i<mutation.addedNodes.length;i++){
                    var node=mutation.addedNodes[i]

                    if(node.nodeName=="#comment"){

                    }else if(node.nodeName=="#text"){
                        var id
                        if(!node["_pf"]){
                            id=session.idNum++
                            node["_pf"]=id
                        }else{
                            id=node["_pf"]
                        }

                        var previousSiblingId=null
                        var nextSiblingId=null
                        if(mutation.previousSibling){
                            previousSiblingId=getPfValue(mutation.previousSibling)
                        }
                        if(mutation.nextSibling){
                            nextSiblingId=getPfValue(mutation.nextSibling)
                        }

                        var event={
                            kind:13,
                            args:[getPfValue(mutation.target),id,node.data,previousSiblingId,nextSiblingId]
                            //type:"ad",
                            //nodeId:getPfValue(mutation.target),
                            //data:{id:id,v:node.data}
                        }

                        session_events.push(addEvent2(event))

                    }else if(node.nodeName=="STYLE"){
                        var attrs=getAttributes(node)

                        var id
                        if(!node["_pf"]){
                            id=session.idNum++
                            node["_pf"]=id
                        }else{
                            id=node["_pf"]
                        }

                        //var data={id:id,n:node.nodeName,a:attrs,in:node.innerHTML}
                        //var event={
                        // type:"ad",
                        // nodeId:getPfValue(mutation.target),
                        // data:data
                        //}

                        var previousSiblingId=null
                        var nextSiblingId=null
                        if(mutation.previousSibling){
                            previousSiblingId=getPfValue(mutation.previousSibling)
                        }
                        if(mutation.nextSibling){
                            nextSiblingId=getPfValue(mutation.nextSibling)
                        }

                        var event={
                            kind:14,
                            args:[getPfValue(mutation.target),id,node.nodeName,attrs,node.innerHTML,previousSiblingId,nextSiblingId]
                        }
                        session_events.push(addEvent2(event))

                    }else{
                        var attrs=getAttributes(node)

                        var id
                        if(!node["_pf"]){
                            id=session.idNum++
                            node["_pf"]=id
                        }else{
                            id=node["_pf"]
                        }

                        var previousSiblingId=null
                        var nextSiblingId=null
                        if(mutation.previousSibling){
                            previousSiblingId=getPfValue(mutation.previousSibling)
                        }
                        if(mutation.nextSibling){
                            nextSiblingId=getPfValue(mutation.nextSibling)
                        }

                        //var data={id:id,n:node.nodeName,a:attrs}

                        var data={}

                        childP(data,node)

                        var event={
                            kind:15,
                            args:[getPfValue(mutation.target),id,node.nodeName,attrs,data.c,previousSiblingId,nextSiblingId]
                            //type:"ad",
                            //nodeId:getPfValue(mutation.target),
                            //data:data
                        }

                        session_events.push(addEvent2(event))

                        if(node.nodeName=="IMG"){
                            //add image href from src
                            var event2={
                                kind:25,
                                args:[id,node.src]
                            }
                            addEvent(event2)
                        }

                        if(node.style.backgroundImage){
                        //add source for image

                        }   
                    }
                }
            }

            if(mutation.removedNodes){
                //console.log("REMOVE")
                for(var i=0;i<mutation.removedNodes.length;i++){
                    var node=mutation.removedNodes[i]

                    if(node.nodeName=="#comment"){
                    //do nothing
                    }else{
                        var pf=getPfValue(node)
                        if(pf!=null){
                            var event={
                                kind:16,
                                args:[pf]
                                //type:"rm",
                                //nodeId:pf,
                                //timeStamp:getTimeStamp()
                            }

                            session_events.push(addEvent2(event))
                        }else{
                            //PF NOT FOUND
                            //console.log("REMOVE")
                            //console.log(node)
                        }
                    }
                }
            }

        }else if (mutation.type=="attributes") {
            var pf=getPfValue(mutation.target)

            if(pf!=null){
                var att=mutation.target.attributes[mutation.attributeName]

                var value=null
                if(att){
                    value=att.value
                }

                var event={
                    kind:17,
                    args:[pf,mutation.attributeName,value]
                    //nodeId:pf,
                    //type:"at",
                    //data:{
                    // n:mutation.attributeName,
                    // v:value
                    //}
                }

                if(mutation.attributeName=="src"){
                    if(mutation.target.nodeName=="IMG"){
                        //add image href from src
                        var event2={
                        kind:25,
                        args:[pf,mutation.target.src]
                    }
                        addEvent(event2)
                    }

                }else if(mutation.attributeName=="style"){
                    if(mutation.target.style.backgroundImage){
                    //add source for image
                    }
                }

                session_events.push(addEvent2(event))
            }else{
                //PF NOT FOUND
                //console.log("STOPPED")
                //observer.disconnect()
                //console.log("ATT")
                //console.log(mutation)
            }

        }else if (mutation.type=="characterData") {
            var pf=getPfValue(mutation.target)
            if(pf!=null){
                var event={
                    kind:18,
                    args:[pf,mutation.target.data]
                    //nodeId:pf,
                    //type:"ch",
                    //data:{v:mutation.target.data}
                }

                session_events.push(addEvent2(event))
            }else{
                //PF NOT FOUND
                //console.log("CD")
                //console.log(mutation)
            }
        }
    }

    var ev={
        kind:9,
        args:[session_events]
        //type:"dm",
        //timeStamp:getTimeStamp(),
        //data:{events:session_events}
    }
    addEvent(ev)
}