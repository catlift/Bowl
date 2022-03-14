export class PhysicsManager {
    /** 开启物理系统 */
    static openPhysicsManager() {
        cc.director.getPhysicsManager().enabled = true
    }

    /** 关闭物理系统 */
    static closePhysicsManager() {
        cc.director.getPhysicsManager().enabled = false
    }

    /** 将刚体设置为静态 */
    static setRigidBodyStatic(node: cc.Node) {
        const rigidBody = node.getComponent(cc.RigidBody)
        rigidBody.type = cc.RigidBodyType.Static
    }

    /** 将刚体设置为动态 */
    static setRigidBodyDynamic(node: cc.Node) {
        const rigidBody = node.getComponent(cc.RigidBody)
        rigidBody.type = cc.RigidBodyType.Dynamic
    }

    /** 为刚体设置线性速度 */
    static setRigidBodyLinearVelocity(node: cc.Node, LV: cc.Vec2) {
        const rigidBody = node.getComponent(cc.RigidBody)
        rigidBody.linearVelocity = LV
    }
}