# http & https

## 前言
这段时间做公司的官网，用的http协议，页面偶尔出现被运营商劫持导致不能正常显示，因此改成https，正好研究下http和https

## http
[wiki](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol)

> 超文本传输协议（HTTP，HyperText Transfer Protocol)是互联网上应用最为广泛的一种网络协议。所有的WWW文件都必须遵守这个标准。设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。1960年美国人Ted Nelson构思了一种通过计算机处理文本信息的方法，并称之为超文本（hypertext）,这成为了HTTP超文本传输协议标准架构的发展根基。Ted Nelson组织协调万维网协会（World Wide Web Consortium）和互联网工程工作小组（Internet Engineering Task Force ）共同合作研究，最终发布了一系列的RFC，其中著名的RFC 2616定义了HTTP 1.1。

### http的特点
- 支持客户/服务器模式。（C/S模式）
- 简单快速：客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有GET、HEAD、POST。每种方法规定了客户与服务器联系的类型不同。由于HTTP协议简单，使得HTTP服务器的程序规模小，因而通信速度很快。
- 灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记。
- 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
- 无状态：HTTP协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快

### http的工作流程
1、建立TCP/IP连接，客户端与服务器通过socket三次握手进行连接
2、客户端向服务器发起HTTP请求（例如：POST/index.html http/1.1）
3、客户端发送请求头信息，请求内容，最后会发送一空白行，标示客户端请求完毕
4、服务器做出应答，表示对客户端请求的应答，例如：HTTP/1.1 200 OK
5、服务器向客户端发送应答头信息
6、服务器向客户端发送应答头信息后，也会发送一空白行，标示应答头信息发送完毕，接着就以Content-type要求的数据格式发送数据给客户端
7、服务器关闭TCP连接，如果服务器或客户端Connection:keep-alive就表示客户端与服务器继续保存连接，在下次请求时可以继续使用这次的连接

### http请求详解
1、General 
- Remote Address 请求发出的那个地址...

2、Response Headers 响应头
- Date 响应的时间
- Content-Type  发送给客户端的实体正文的媒体类型
- Transfer-Encoding 定义请求的传输编码
- Connection 允许客户端或服务器中任何一方关闭底层的连接双方都会要求在处理请求后关闭或者保持它们的TCP连接
- Vary 告诉下游代理是使用缓存响应还是从原始服务器请求
- X-Powered-By 自定义响应头
- Cache-Control 这个字段用于指定所有缓存机制在整个请求/响应链中必须服从的指令。这些指令指定用于阻止缓存对请求或响应造成不利干扰的行为。这些指令通常覆盖默认缓存算法。缓存指令是单向的，即请求中存在一个指令并不意味着响应中将存在同一个指令。

3、Request Header 请求头
- Connetion 
- Accept 指定客户端接受哪些类型的信息
- X-Requested-With 说明请求的请求方式，是同步还是异步，如果参数是null，说明是传统的同步请求，如果是XMLHttpRequest，则说明是ajax的异步请求
- Referer
- Accept-Encoding 用于指定可接受的内容编码

4、Query String Parameters


## https
HyperText Transfer Protocol Secure
![https](https://images2015.cnblogs.com/blog/916774/201611/916774-20161110164813811-554326797.jpg)

在常规的TCP协议上加了一层TLS或SSL协议，端口不是常规的HTTP的80端口，而是443端口。

### https的工作流程
1、客户端发起HTTPS请求

这个没什么好说的，就是用户在浏览器里输入一个https网址，然后连接到server的443端口。

2、服务端的配置

采用HTTPS协议的服务器必须要有一套数字证书，可以自己制作，也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面(startssl就是个不错的选择，有1年的免费服务)。这套证书其实就是一对公钥和私钥，如果对公钥和私钥不太理解，可以想象成一把钥匙和一个锁头，只是全世界只有你一个人有这把钥匙，你可以把锁头给别人，别人可以用这个锁把重要的东西锁起来，然后发给你，因为只有你一个人有这把钥匙，所以只有你才能看到被这把锁锁起来的东西。

3、传送证书

这个证书其实就是公钥，只是包含了很多信息，如证书的颁发机构，过期时间等等。

4、客户端解析证书

这部分工作是有客户端的TLS来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警告框，提示证书存在问题。如果证书没有问题，那么就生成一个随机值，然后用证书对该随机值进行加密，就好像上面说的，把随机值用锁头锁起来，这样除非有钥匙，不然看不到被锁住的内容。

5、传送加密信息

这部分传送的是用证书加密后的随机值，目的就是让服务端得到这个随机值，以后客户端和服务端的通信就可以通过这个随机值来进行加密解密了。

6、服务段解密信息

服务端用私钥解密后，得到了客户端传过来的随机值(私钥)，然后把内容通过该值进行对称加密，所谓对称加密就是，将信息和私钥通过某种算法混合在一起，这样除非知道私钥，不然无法获取内容，而正好客户端和服务端都知道这个私钥，所以只要加密算法够彪悍，私钥够复杂，数据就够安全。

7、传输加密后的信息

这部分信息是服务端用私钥加密后的信息，可以在客户端被还原。

8、客户端解密信息

客户端用之前生成的私钥解密服务段传过来的信息，于是获取了解密后的内容，整个过程第三方即使监听到了数据，也束手无策。