# eMusic

## 安装sqlite
```
./node_modules/.bin/electron-rebuild
```

## taglib2
修改package.json内容
```
"compile:electron": "cmake-js rebuild -r electron -v 1.6.2 --abi=54 -a x64 -C -s c++11",    
```
