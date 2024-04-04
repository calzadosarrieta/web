

sync()
{
    echo $1

    conflicts=$(git ls-files -u)
    if [ -z "$conflicts" ]; then
        git add .
        git commit -m "$1" # $(date)
        git pull --rebase
        git push origin HEAD
    fi

    status=$(git ls-files -u)
    if [ -z "$status" ]; then
        echo "Everything clean"
    else
        echo "$status"
        read -p "Failed to pull/push. Presh to continue"
    fi
}

sh compress.sh

sh crearProductos.sh

sync "sandra"
