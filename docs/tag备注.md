# 给每一章打Tag指令

```bash
# 本地创建tag 并提交远程同步
git tag -a chap05 -m "chapter5 排行榜单模块开发"
git push origin --tags

# 同步远程tag
git fetch --tags

# 查看某个远程tag
git fetch --tags

# 查看所有Tag
git tag

# 查看某个Tag信息
git show [tag名称]

# 切换到某个Tag下代码
git checkout [tag名称]

# 这时候 git 可能会提示你当前处于一个“detached HEAD" 状态。
# 因为 tag 相当于是一个快照，是不能更改它的代码的。
# 如果要在 tag 代码的基础上做修改，你需要一个分支
git checkout -b branch_name tag_name  # 从tag创建一个分支

# 取所有分支 git fetch 仓库名
git fetch origin

# 取特定分支 git fetch 仓库名 分支名
git fetch origin [分支名]
```
